import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { useEffect, useMemo, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface RichTextInputProps extends React.HTMLProps<HTMLTextAreaElement> {
  label: string;
  value?: string;
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

  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

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

    setEditorState(editorState);
  }, [value]);

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const newValue = useMemo(() => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }, [editorState]);

  return (
    <div>
      <h3 className="heading3 text-white mb-2">{label}</h3>
      <Editor
        editorState={editorState}
        wrapperClassName={classes.rtiContainer}
        editorClassName={classes.rtiEditor}
        onEditorStateChange={onEditorStateChange}
        onBlur={() => onChange(newValue)}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'],
        }}
      />
    </div>
  );
};

export default RichTextInput;
