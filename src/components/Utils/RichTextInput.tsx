import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface RichTextInputProps {
  label: string;
  value: string | null;
  onChange: any;
}

const useStyles = makeStyles(theme =>
  createStyles({
    rtiContainer: {
      background: '#fff',
      border: '1px solid #000',
      borderRadius: '4px',
    },
    rtiEditor: {
      padding: theme.spacing(2),
    },
  }),
);

const RichTextInput = ({ value, onChange, label }: RichTextInputProps) => {
  const classes = useStyles();

  const [state, setState] = useState<{
    value: string | null;
    editorState: EditorState;
  }>({
    value: null,
    editorState: EditorState.createEmpty(),
  });

  useEffect(() => {
    let editorState = EditorState.createEmpty();

    if (!!value) {
      const blocks = htmlToDraft(value);
      const state = ContentState.createFromBlockArray(
        blocks.contentBlocks,
        blocks.entityMap,
      );

      editorState = EditorState.createWithContent(state);
    }

    setState({
      value,
      editorState,
    });
  }, [value]);

  const onEditorStateChange = (state: EditorState) => {
    setState({
      value: draftToHtml(convertToRaw(state.getCurrentContent())),
      editorState: state,
    });
  };

  return (
    <div>
      <h3 className="heading3 text-white mb-2">{label}</h3>
      <Editor
        editorState={state.editorState}
        wrapperClassName={classes.rtiContainer}
        editorClassName={classes.rtiEditor}
        onEditorStateChange={onEditorStateChange}
        onBlur={() => onChange(state.value)}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'],
        }}
      />
      <textarea
        disabled={true}
        style={{ display: 'none' }}
        value={state.value || ''}
      />
    </div>
  );
};

export default RichTextInput;
