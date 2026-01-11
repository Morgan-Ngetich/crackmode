// api/simple.js
export default function handler(req, res) {
  console.log('Simple API called')
  return res.status(200).json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date().toISOString()
  })
}