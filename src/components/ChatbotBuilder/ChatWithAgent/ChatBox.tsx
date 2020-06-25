import React, { useRef, useEffect } from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      border: "0.5px solid black",
      padding: theme.spacing(2),
      maxHeight: '200px',
      overflowY: 'auto'
    },
    bubbleContainer: {
      width: "100%",
      display: "flex"
    },
    left: {
      justifyContent: 'flex-start!important'
    },
    right: {
      justifyContent: 'flex-end!important'
    },
    bubble: {
      border: "0.5px solid black",
      borderRadius: "10px",
      margin: "0px 5px",
      padding: "10px",
      display: "inline-block"
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
      order: 1
    },
  }),
);

interface IChatBoxProps {
  loading: any;
  chatResponse: any;
  currentTxt: string;
}

const ChatBox: React.FC<IChatBoxProps> = ({ loading, chatResponse, currentTxt }) => {
  const classes = useStyles();
  let data = chatResponse && chatResponse.map((singleMsg: any) => {
    const { actor, utterance } = singleMsg
    if (actor === "USER") {
      return {
        message: utterance,
        direction: "right"
      }
    } else {
      return {
        message: utterance,
        direction: "left"
      }
    }
  })
  if (loading) {
    data = [...data, {
      message: currentTxt,
      direction: "right"
    }, {
      message: "Typing..........",
      direction: "left"
    }]
  }
  const messagesEndRef: React.MutableRefObject<any> = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [chatResponse, loading]);

  const chatBubbles = data && data.map((obj: any, i = 0) => {

    const alignClass = obj.direction === 'left' ? classes.left : classes.right;

    return (
      <div className={`${classes.bubbleContainer} ${alignClass}`} key={i}>
        {obj.direction === 'left' ? <Avatar className={classes.orange}>A</Avatar> : <Avatar className={classes.purple}>U</Avatar>}
        <div key={i++} className={classes.bubble}>
          <div>{obj.message}</div>
        </div>
      </div>
    )
  });

  return <div className={classes.container}>{chatBubbles}<div ref={messagesEndRef}>&nbsp;</div></div>;
};

export default ChatBox;
