const json = `
{
  "intents": [
    "flight"
  ],
  "tagTypes": ["fromloc.city_name", "toloc.city_name", "stoploc.city_name"],
  "examples": [
    {
      "text": "i would like to find a flight from charlotte to las vegas that makes a stop in st. louis",
      "intent": "flight",
      "tags": [
        {
          "start": 35,
          "end": 44,
          "type": "fromloc.city_name"
        },
        {
          "start": 48,
          "end": 57,
          "type": "toloc.city_name"
        },
        {
          "start": 79,
          "end": 88,
          "type": "stoploc.city_name"
        }
      ]
    }
  ]
}
`;

export default json;
