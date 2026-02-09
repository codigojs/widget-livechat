# Flujo de mensajes del websocket

Los mensajes que devuelve el websocket pueden tener las siguientes estructuras:

## Mensajes de tipo "interactive"

```json
{
  "message": "🎉 ¡Qué gran paso acabas de dar! Para continuar, necesitamos tu aceptación para que tus datos sean tratados conforme a la ley 1581 de 2012. 📜",
  "type": "interactive",
  "options": [
    {
      "name": "Acepto",
      "value": "m1vblou1pvcodrhooiu22fmo"
    },
    {
      "name": "No acepto",
      "value": "yuwapbx4lgbvsj2rp0eum62j"
    }
  ]
}
```

## Mensajes de tipo "action"

```json
{
  "message": "Observamos que no te estás comunicando desde tu número de contacto principal registrado en tu cuenta. Para tu seguridad, te conectaremos con un asesor que te ayudará a confirmar tu identidad. Si no logramos conectarte, por favor intenta nuevamente en nuestros horarios establecidos: de lunes a viernes de 8:00 AM a 6:00 PM, y los sábados de 8:00 AM a 2:30 PM. También puedes contactarnos al 3009133874. ¡Gracias por tu comprensión! 😊",
  "type": "action",
  "action": "close",
  "multiple": true
}
```

```json
{
  "message": "Aquí tienes el archivo que solicitaste.",
  "type": "attachment",
  "attachment": {
    "fileName": "documento_importante.pdf",
    "fileType": "application/pdf",
    "fileUrl": "https://ejemplo.com/archivos/documento_importante.pdf",
    "thumbnailUrl": "https://ejemplo.com/miniaturas/documento_importante.jpg",
  }
}
```
