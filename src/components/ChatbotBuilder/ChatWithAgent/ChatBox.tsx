import React from "react";
import { createStyles,  makeStyles,  Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
        border: "0.5px solid black",
        padding: theme.spacing(2),
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
        order:1
      },
  }),
);


const ChatBox = () => {
  const classes = useStyles();
  const dummyData = [
    {
      message: "1: This should be in left",
      direction: "left"
    },
    {
      message: "2: This should be in right",
      direction: "right"
    },
    {
      message: "3: This should be in left again",
      direction: "left"
    },
    {
      message: "4: This should be in right again",
      direction: "right"
    }
  ];

  const chatBubbles = dummyData.map((obj, i = 0) =>  {

  const alignClass = obj.direction === 'left' ? classes.left : classes.right;

  return (
    <div className={`${classes.bubbleContainer} ${alignClass}`} key={i}>
      {obj.direction === 'left' ? <Avatar className={classes.orange}>A</Avatar>  :  <Avatar className={classes.purple}>U</Avatar>}
      <div key={i++} className={classes.bubble}>
        <div>{obj.message}</div>
      </div>
    </div>
  )});
  return <div className={classes.container}>{chatBubbles}</div>;
};

export default ChatBox;
