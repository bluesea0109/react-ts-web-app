import React from 'react';
import Highlight from 'react-highlight';

interface AgentEmbedCodeProps {
  agentUname: string;
  apiKey: string;
}

export default function AgentEmbedCode({
  agentUname,
  apiKey,
}: AgentEmbedCodeProps) {
  return (
    <Highlight className="html">
      {`
          <script>
            (function(id,k,d){
                return function(i,s,o,g,r,a,m){
                    a=s.createElement(o),m=s.querySelector("body"),
                    a.onload=function(){i[r](id,k,d)},
                    a.async=1;a.src=g;m.appendChild(a),a.type="application/javascript"
                }
            })('${agentUname}', '${apiKey}', true)
            (window,document,'script','{{ baseurl }}/main.bundle.js','bavard');
          </script>
        `}
    </Highlight>
  );
}
