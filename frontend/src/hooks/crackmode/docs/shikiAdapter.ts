import { createShikiAdapter } from "@chakra-ui/react"
import type { Highlighter } from "shiki"

// Cache the promise instead of the instance to avoid race conditions
let highlighterPromise: Promise<Highlighter> | null = null
let highlighterInstance: Highlighter | null = null

export const shikiAdapter = createShikiAdapter<Highlighter>({
  async load() {
    // If we already have a valid instance, return it
    if (highlighterInstance && highlighterPromise) {
      return highlighterPromise
    }

    // If promise exists but instance doesn't, it might be disposed
    // Reset and create new one
    if (highlighterPromise && !highlighterInstance) {
      highlighterPromise = null
    }

    // Create new highlighter if needed
    if (!highlighterPromise) {
      highlighterPromise = (async () => {
        const { createHighlighter } = await import("shiki")
        const highlighter = await createHighlighter({
          // Only essential languages for LeetCode/DSA
          langs: [
            "typescript",  // For TypeScript solutions
            "javascript",  // For JavaScript solutions
            "python",      // For Python solutions
            "java",        // For Java solutions
            "cpp",         // For C++ solutions (use 'cpp' not 'c++')
          ],
          // Only dark theme for smaller bundle
          themes: ["github-dark"],
        })
        highlighterInstance = highlighter
        return highlighter
      })()
    }

    return highlighterPromise
  },
  // Only dark theme
  theme: "github-dark"
})

// Cleanup function
export const disposeShikiHighlighter = async () => {
  if (highlighterInstance) {
    try {
      highlighterInstance.dispose()
    } catch (error) {
      // Ignore if already disposed
      console.warn('Shiki instance already disposed:', error)
    }
  }
  highlighterInstance = null
  highlighterPromise = null
}

// Handle Vite HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeShikiHighlighter()
  })
  
  // Also accept the module to prevent full reload
  import.meta.hot.accept(() => {
    console.log('Shiki adapter module updated')
  })
}