/* This is a generic payload parser that can be used as a starting point for MQTT devices
** The code expects to receive a string hexadecimal data, and not JSON formatted data.
**
** Testing:
** You can do manual tests to the parse by using the Device Emulator. Copy and Paste the following JSON:
** [{ "variable": "payload", "value": "0109611395", "metadata": { "mqtt_topic": "data" } } ]
*/

// Prevents the code from running for other types data insertions.
// We search for a variable name payload or a variable with metadata.mqtt_topic
const mqtt_payload = payload.find((data) => data.variable === "payload" || (data.metadata && data.metadata.mqtt_topic));
if (mqtt_payload) {
  // Cast the hexadecimal to a buffer.
  const buffer = Buffer.from(mqtt_payload.value, 'hex')

 // Normalize the data to TagoIO format.
 // We use Number function to cast number values, so we can use it on chart widgets, etc.
  const data = [
    { variable: 'protocol_version',  value: buffer.readInt8(0) },
    { variable: 'temperature',  value: buffer.readInt16BE(1) / 100, unit: '°C' },
    { variable: 'humidity',  value: buffer.readUInt16BE(3) / 100, unit: '%' },
  ];

  // This will concat the content sent by your device with the content generated in this payload parser.
  // It also adds the field "serie" to be able to group in tables and other widgets.
  const serie = String(new Date().getTime());
  payload = payload.concat(data).map(x => ({ ...x, serie }));
}
