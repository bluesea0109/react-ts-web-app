const fetch = require('node-fetch');
const fs = require('fs');

// When an update is required to fragmentTypes
// Run this file only after replacing
// Authorization header with latest token
fetch("https://api-gateway-dot-bavard-dev.appspot.com/graphql", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQW5zaHVsIFNhbmdoaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaXlxWjUxMV9sRkxaOXlVeEl0bWZCTE1TbjM3Z1Jicll0RG5saTg5QSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9iYXZhcmQtZGV2IiwiYXVkIjoiYmF2YXJkLWRldiIsImF1dGhfdGltZSI6MTU5NTcxMzg1NiwidXNlcl9pZCI6ImNFOWhaSHc1VXdmaTJJdVBvUk44ckJyQkRONjIiLCJzdWIiOiJjRTloWkh3NVV3ZmkySXVQb1JOOHJCckJETjYyIiwiaWF0IjoxNTk1NzE3NDMzLCJleHAiOjE1OTU3MjEwMzMsImVtYWlsIjoiYW5zaGFwMTcxOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMDQ4OTYwMDkwNjIxMDA3MzAzNyJdLCJlbWFpbCI6WyJhbnNoYXAxNzE5QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifSwidWlkIjoiY0U5aFpIdzVVd2ZpMkl1UG9STjhyQnJCRE42MiIsImF1dGhUeXBlIjoidXNlciIsInVzZXJPcmdSb2xlcyI6eyJhNTc5ZTc0NC0xYmE0LTQ2MDktYjA1Yy01YjNmYWYyYWYzNmQiOiJvd25lciJ9LCJ1c2VyUHJvamVjdFJvbGVzIjp7ImI1M2JjYTYzLTk5NGMtNGNjOC04YzdkLTQ2NWQzM2RjMWQ0NyI6Im93bmVyIiwiYzc4OGViYzMtMGE3My00Yzg0LWFmMDEtMTlmMjA2MTIyMjYzIjoib3duZXIifSwiYXBpS2V5UHJvamVjdCI6IiJ9.tFPLVsVhH1dUsgyYpmVlIp3D8q2ssNdultFwmkNWHAE"
  },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    );
    result.data.__schema.types = filteredData;
    fs.writeFileSync('./src/fragmentTypes.json', JSON.stringify(result.data), err => {
      if (err) {
        console.error('Error writing fragmentTypes file', err);
      } else {
        console.log('Fragment types successfully extracted!');
      }
    });
  });
