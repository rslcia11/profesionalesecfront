import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/593XXXXXXXXX"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}
