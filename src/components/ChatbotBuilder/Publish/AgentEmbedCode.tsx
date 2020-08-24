import React from 'react';
import Highlight from 'react-highlight';

interface AgentEmbedCodeProps {
  agentId: number;
  apiKey: string;
}

export default function AgentEmbedCode({
  agentId,
  apiKey,
}: AgentEmbedCodeProps) {
  return (
    <Highlight className="html">
      {`
          <script>
              (function(id,k){
                  return function(i,s,o,g,r,a,m){
                      a=s.createElement(o),m=s.querySelector("body"),
                      a.onload=function(){i[r](id,k)},
                      a.async=1;a.src=g;m.appendChild(a),a.type="application/javascript"
                  }
              })('${agentId}', '${apiKey}')
              (window,document,'script','https://bavard-chatbot.web.app/main.bundle.js','bavard');
          </script>
        `}
    </Highlight>
  );
}
