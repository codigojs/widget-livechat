import React from "react";
import { useMessageProcessor } from "../hooks/useMessageProcessor";
import type { MessageReceive } from "../types/types";

/**
 * Ejemplo de uso de los diferentes tipos de mensajes
 * Este archivo muestra cómo crear y procesar diferentes tipos de mensajes
 */
export const MessageTypesExample: React.FC = () => {
  const { processMessage } = useMessageProcessor();

  // Ejemplo de mensaje de texto simple
  const textMessage: MessageReceive = {
    type: "message",
    content: {
      type: "text",
      text: "Hola, ¿en qué puedo ayudarte?",
      markdown: false,
      html: false,
    },
    timestamp: new Date().toISOString(),
  };

  // Ejemplo de mensaje de consentimiento
  const consentMessage: MessageReceive = {
    type: "message",
    content: {
      type: "consent",
      text: "¿Aceptas que recopilemos tus datos para mejorar el servicio?",
      acceptText: "Aceptar",
      declineText: "Rechazar",
      url: "https://example.com/privacy",
      onAccept: () => console.log("Usuario aceptó el consentimiento"),
      onDecline: () => console.log("Usuario rechazó el consentimiento"),
    },
    timestamp: new Date().toISOString(),
  };

  // Ejemplo de mensaje con botones
  const buttonsMessage: MessageReceive = {
    type: "message",
    content: {
      type: "buttons",
      text: "Selecciona una opción:",
      buttons: [
        {
          id: "1",
          text: "Información",
          value: "info",
          action: "reply",
          onClick: () => console.log("Usuario seleccionó Información"),
        },
        {
          id: "2",
          text: "Contacto",
          value: "contact",
          action: "url",
          url: "https://example.com/contact",
          onClick: () => window.open("https://example.com/contact", "_blank"),
        },
        {
          id: "3",
          text: "Llamar",
          value: "call",
          action: "phone",
          phone: "+1234567890",
          onClick: () => window.open("tel:+1234567890"),
        },
      ],
      layout: "horizontal",
    },
    timestamp: new Date().toISOString(),
  };

  // Ejemplo de mensaje con formulario
  const formMessage: MessageReceive = {
    type: "message",
    content: {
      type: "form",
      title: "Formulario de contacto",
      fields: [
        {
          name: "name",
          label: "Nombre completo",
          type: "text",
          required: true,
          placeholder: "Ingresa tu nombre",
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          name: "email",
          label: "Correo electrónico",
          type: "email",
          required: true,
          placeholder: "tu@email.com",
        },
        {
          name: "phone",
          label: "Teléfono",
          type: "tel",
          required: false,
          placeholder: "+1234567890",
        },
        {
          name: "subject",
          label: "Asunto",
          type: "select",
          required: true,
          options: [
            { label: "Consulta general", value: "general" },
            { label: "Soporte técnico", value: "support" },
            { label: "Ventas", value: "sales" },
            { label: "Otro", value: "other" },
          ],
        },
        {
          name: "message",
          label: "Mensaje",
          type: "textarea",
          required: true,
          placeholder: "Describe tu consulta...",
          validation: {
            minLength: 10,
            maxLength: 500,
          },
        },
        {
          name: "newsletter",
          label: "Suscribirse al newsletter",
          type: "checkbox",
          required: false,
        },
      ],
      submitText: "Enviar formulario",
      onSubmit: (data) => {
        console.log("Datos del formulario:", data);
        // Aquí puedes enviar los datos al servidor
      },
    },
    timestamp: new Date().toISOString(),
  };

  // Ejemplo de mensaje de transferencia
  const transferMessage: MessageReceive = {
    type: "message",
    content: {
      type: "transfer",
      text: "Te estoy transfiriendo a un agente humano...",
      agentName: "María García",
      estimatedWaitTime: 2,
      isTransferring: true,
    },
    timestamp: new Date().toISOString(),
  };

  // Ejemplo de mensaje del sistema
  const systemMessage: MessageReceive = {
    type: "message",
    content: {
      type: "system",
      text: "Tu sesión ha sido iniciada correctamente",
      variant: "success",
      icon: "✅",
    },
    timestamp: new Date().toISOString(),
  };

  // Función para procesar todos los ejemplos
  const processExamples = () => {
    const examples = [
      textMessage,
      consentMessage,
      buttonsMessage,
      formMessage,
      transferMessage,
      systemMessage,
    ];

    examples.forEach((example, index) => {
      console.log(`Procesando ejemplo ${index + 1}:`, example.content.type);
      const processed = processMessage(example);
      if (processed) {
        console.log(`Ejemplo ${index + 1} procesado:`, processed);
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ejemplos de Tipos de Mensajes</h2>
      <p className="mb-4">
        Este componente muestra ejemplos de cómo crear y procesar diferentes tipos de mensajes.
        Abre la consola del navegador para ver los logs.
      </p>
      <button
        onClick={processExamples}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Procesar Ejemplos
      </button>
    </div>
  );
}; 