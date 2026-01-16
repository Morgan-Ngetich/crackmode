import type { DocSection } from "../client/types/docs"

export const sidebarConfig: DocSection[] = [
  {
    title: "Introduction",
    links: [
      { title: "What is Crackmode?", href: "/docs#welcome-to-crackmode" },
      // { title: "Getting Started", href: "/docs/introduction/getting-started" },
      // { title: "How to Use This Platform", href: "/docs/introduction/how-to-use" }
    ]
  },
  {
    title: "LeetCode 75",
    links: [
      {
        title: "What is Leetcode75",
        href: "/docs/leetcode75/"
      },
      {
        title: "Arrays & Strings",
        href: "/docs/leetcode75/arrays-strings",
        children: [
          { title: "Introduction", href: "/docs/leetcode75/arrays-strings" },
          { title: "Merge Strings Alternately", href: "/docs/leetcode75/arrays-strings/merge-strings-alternately" },
          { title: "GCD of Strings", href: "/docs/leetcode75/arrays-strings/gcd-of-strings" },
          { title: "Kids With Greatest Candies", href: "/docs/leetcode75/arrays-strings/kids-with-greatest-candies" },
          { title: "Product of Array Except Self", href: "/docs/leetcode75/arrays-strings/product-of-array-except-self" },
          { title: "Increasing Triplet Subsequence", href: "/docs/leetcode75/arrays-strings/increasing-triplet-subsequence" },
          { title: "String Compression", href: "/docs/leetcode75/arrays-strings/string-compression" },
        ],
      },
      { title: "Linked Lists", href: "/docs/leetcode75/linked-lists" },
      { title: "Trees & Graphs", href: "/docs/leetcode75/trees-graphs" },
      { title: "Dynamic Programming", href: "/docs/leetcode75/dynamic-programming" },
      { title: "Binary Search", href: "/docs/leetcode75/binary-search" },
      { title: "Intervals", href: "/docs/leetcode75/intervals" },
      { title: "Backtracking", href: "/docs/leetcode75/backtracking" },
      { title: "Stack & Queue", href: "/docs/leetcode75/stack-queue" },
      { title: "Heap / Priority Queue", href: "/docs/leetcode75/heap" }
    ]
  },
  {
    title: "Problems",
    links: [
      { title: "Implement Stack using Queues", href: "/docs/problems/implement-stack-using-queues" },
      { title: "Longest Consecutive Sequence", href: "/docs/problems/longest-consecutive-sequence" },
      { title: "Missing Number", href: "/docs/problems/missing-number" },
      { title: "Check if Number Has Equal Digit Count and Digit Value", href: "/docs/problems/check-if-number-has-equal-digit-count-and-digit-value" },
      { title: "Find the Difference of Two Arrays", href: "/docs/problems/find-the-difference-of-two-arrays" },
      { title: "Unique Number of Occurrences", href: "/docs/problems/unique-number-of-occurrences" },
      { title: "Find the Difference", href: "/docs/problems/find-the-difference" },
      { title: "Find All Numbers Disappeared in an Array", href: "/docs/problems/find-all-numbers-disappeared-in-an-array" },
      { title: "Find All Duplicates in an Array", href: "/docs/problems/find-all-duplicates-in-an-array" },
      { title: "Number if Good Pairs", href: "/docs/problems/number-of-good-pairs" },
      { title: "Distribute Candies", href: "/docs/problems/distribute-candies" },
      { title: "Longest Palindrome", href: "/docs/problems/longest-palindrome" },
      { title: "Most Common Word", href: "/docs/problems/most-common-word" },
      { title: "Merge Sorted Array", href: "/docs/problems/merge-sorted-array" },
      { title: "Best Time to Buy and Sell Stock", href: "/docs/problems/best-time-to-buy-and-sell-stock" },
      { title: "Number of 1 bits", href: "/docs/problems/number-of-1-bits" },
      { title: "Two sum", href: "/docs/problems/two-sum" },
      { title: "Contains Duplicate", href: "/docs/problems/contains-duplicate" },
      { title: "Determine if Two Strings are Close", href: "/docs/problems/determine-if-two-strings-are-close" },
      { title: "Valid Parentheses", href: "/docs/problems/valid-parentheses" },
      { title: "Asteroid Collision", href: "/docs/problems/asteroid-collision" },
    ]
  },
  {
    title: "System Design",
    links: [
      { title: "Basics of System Design", href: "/docs/system-design/basics" },
      { title: "Scalability & Load Balancing", href: "/docs/system-design/scalability" },
      { title: "Databases & Storage", href: "/docs/system-design/databases" },
      { title: "Caching Strategies", href: "/docs/system-design/caching" },
      { title: "Message Queues & Events", href: "/docs/system-design/message-queues" },
      { title: "Case Studies", href: "/docs/system-design/case-studies" }
    ]
  },
  {
    title: "Patterns",
    links: [
      { title: "Two Pointers", href: "/docs/patterns/two-pointers" },
      { title: "Sliding Window", href: "/docs/patterns/sliding-window" },
      { title: "Binary Search Patterns", href: "/docs/patterns/binary-search" },
      { title: "DFS / BFS", href: "/docs/patterns/dfs-bfs" },
      { title: "Greedy Algorithms", href: "/docs/patterns/greedy" },
      { title: "Divide & Conquer", href: "/docs/patterns/divide-conquer" },
      { title: "DP Patterns", href: "/docs/patterns/dp-patterns" }
    ]
  },
  {
    title: "Interview Prep",
    links: [
      { title: "Behavioral Questions", href: "/docs/interview/behavioral" },
      { title: "Mock Interviews", href: "/docs/interview/mock-interviews" },
      { title: "Resume & Portfolio Tips", href: "/docs/interview/resume-portfolio" },
      { title: "FAANG / Top Tech Guides", href: "/docs/interview/faang-guides" }
    ]
  },
  {
    title: "Resources",
    links: [
      { title: "Roadmaps", href: "/docs/resources/roadmaps" },
      { title: "Cheat Sheets", href: "/docs/resources/cheat-sheets" },
      { title: "Books & Courses", href: "/docs/resources/books-courses" },
      { title: "Tools & Extensions", href: "/docs/resources/tools" }
    ]
  },
  {
    title: "Community",
    links: [
      { title: "Join Crackmode Sessions", href: "/docs/community/sessions" },
      { title: "Discussion Forum", href: "/docs/community/forum" },
      { title: "Contribute to Docs", href: "/docs/community/contribute" }
    ]
  }
]