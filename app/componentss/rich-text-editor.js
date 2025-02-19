import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = (props) => {
  const handleEditorChange = (content, editor) => {
    const contentToHtml = editor.getContent({
      format: 'html'
    });

    props.onChange && props.onChange(contentToHtml);
  };

  return (
    <Editor
      apiKey='wpw23ifwx8wde0llubv6ot9vw51mlx4qpf7aohohuurprtqh'
      init={{
        plugins: [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
      }}
      onChange={handleEditorChange}
      initialValue={props.defaultValue}
    />
  );
};

export default RichTextEditor;