import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/919137277233"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      data-testid="link-whatsapp"
    >
      <FaWhatsapp aria-hidden="true" focusable="false" />
    </a>
  );
}