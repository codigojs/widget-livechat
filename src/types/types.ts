export interface LiveChatInitConfig {
  agent_id: string;
  session_id?: string;
  position: string;
  width: number;
  height: number;
  background_color?: string;
  text_color: string;
  title: string;
  button_color: string;
  button_text_color: string;
  submit_text: string;
  initial_message: string;
  zindex: number;
  avatar_url: string;
  full_screen: boolean;
  consent_main: boolean;
  consent_intro_message: string;
  consent_url: string;
}

export interface VectorDbResponse {
  detail: string;
  reason?: string;
  message?: string;
  confidence?: number;
  response?: string;
  intent?: string;
}

export interface WebsocketMessageData {
  action: string;
  id_recipient: string;
  recipient: string;
  id_user: string;
  user_name: string;
  status: string;
  questions: string; // TODO: Ver tipo de dato
  id_as_ws: string;
  id_contact: number;
}

export interface WebsocketMessage {
  type: string;
  data: WebsocketMessageData;
}

export interface Attachment {
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
}

// Sistema de tipos de mensajes mejorado
export type MessageContentType = 
  | "text"           // Mensaje de texto simple
  | "consent"        // Banner de consentimiento
  | "form"           // Formulario interactivo
  | "buttons"        // Botones de opciones
  | "carousel"       // Carrusel de opciones
  | "file"           // Archivo adjunto
  | "image"          // Imagen
  | "video"          // Video
  | "audio"          // Audio
  | "location"       // Ubicación
  | "contact"        // Información de contacto
  | "quick_reply"    // Respuestas rápidas
  | "rating"         // Sistema de calificación
  | "calendar"       // Selector de fecha/hora
  | "payment"        // Proceso de pago
  | "transfer"       // Transferencia a agente humano
  | "system"         // Mensajes del sistema
  | "error"          // Mensajes de error
  | "success"        // Mensajes de éxito
  | "loading"        // Indicador de carga
  | "custom";        // Mensaje personalizado

// Interfaces base para diferentes tipos de contenido
export interface BaseMessageContent {
  type: MessageContentType;
  id?: string;
  timestamp?: string;
}

export interface TextMessageContent extends BaseMessageContent {
  type: "text";
  text: string;
  markdown?: boolean;
  html?: boolean;
}

export interface ConsentMessageContent extends BaseMessageContent {
  type: "consent";
  text: string;
  acceptText?: string;
  declineText?: string;
  url?: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

export interface FormMessageContent extends BaseMessageContent {
  type: "form";
  title: string;
  fields: FormField[];
  submitText?: string;
  onSubmit?: (data: Record<string, string | number | boolean>) => void;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea" | "checkbox" | "radio" | "date";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface ButtonsMessageContent extends BaseMessageContent {
  type: "buttons";
  text: string;
  buttons: ButtonOption[];
  layout?: "horizontal" | "vertical";
}

export interface ButtonOption {
  id: string;
  text: string;
  value: string;
  action: "reply" | "url" | "phone" | "email" | "custom";
  url?: string;
  phone?: string;
  email?: string;
  onClick?: () => void;
}

export interface CarouselMessageContent extends BaseMessageContent {
  type: "carousel";
  items: CarouselItem[];
  showIndicators?: boolean;
  autoPlay?: boolean;
}

export interface CarouselItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  buttons?: ButtonOption[];
}

export interface FileMessageContent extends BaseMessageContent {
  type: "file";
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  thumbnailUrl?: string;
}

export interface QuickReplyMessageContent extends BaseMessageContent {
  type: "quick_reply";
  text: string;
  options: QuickReplyOption[];
}

export interface QuickReplyOption {
  id: string;
  text: string;
  value: string;
}

export interface RatingMessageContent extends BaseMessageContent {
  type: "rating";
  text: string;
  maxRating: number;
  currentRating?: number;
  onRate?: (rating: number) => void;
}

export interface TransferMessageContent extends BaseMessageContent {
  type: "transfer";
  text: string;
  agentName?: string;
  estimatedWaitTime?: number;
  isTransferring: boolean;
}

export interface SystemMessageContent extends BaseMessageContent {
  type: "system";
  text: string;
  variant?: "info" | "warning" | "error" | "success";
  icon?: string;
}

// Union type para todos los tipos de contenido
export type MessageContent = 
  | TextMessageContent
  | ConsentMessageContent
  | FormMessageContent
  | ButtonsMessageContent
  | CarouselMessageContent
  | FileMessageContent
  | QuickReplyMessageContent
  | RatingMessageContent
  | TransferMessageContent
  | SystemMessageContent;

// Actualización de la interfaz MessageReceive
export interface MessageReceive {
  type: "message" | "system" | "event";
  content: MessageContent;
  timestamp?: string;
  session_id?: string;
  metadata?: {
    agent_id?: string;
    user_id?: string;
    channel?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface HistoryMessage {
  sender: Sender;
  message: string;
  timestamp: number;
  type: string;
  options?: Option[];
  attachment?: Attachment;
}

interface Option {
  name: string;
  value: string;
  level: null;
}

interface Sender {
  id: string;
  name: string;
  role: string;
}

export interface Message {
  type: "user" | "assistant" | "human";
  content: React.ReactNode;
  timestamp: string;
}

interface MessageType {
  type: "user" | "assistant";
}

export interface UserMessageType extends MessageType {
  type: "user";
  content: string;
}

export interface BotMessageType extends MessageType {
  type: "assistant";
  content: React.ReactNode;
}

export interface SupabaseMessage {
  id?: string;
  created_at: string;
  session_id: string;
  agent_id: string;
  content: string;
  role: 'user' | 'assistant' | 'human';
}

export interface ProcessedMessage {
  type: string;
  content: React.ReactNode;
  timestamp: string;
}

export interface PresenceState {
  presence_ref: string;
  typing?: boolean;
  online?: boolean;
}