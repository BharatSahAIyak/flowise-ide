"use client";

import React, { useEffect, useRef, useState } from 'react'
import {basicSetup} from "codemirror"
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import {autocompletion} from "@codemirror/autocomplete"
import { myCompletions } from './autocomplete';


export default function CodeEditor() {
  const editor = useRef()
  const [code, setCode] = useState('')
  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString())
  })

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'select ',
      
      extensions: [
        basicSetup,
        oneDark,
        keymap.of([defaultKeymap, indentWithTab]),
        javascript(),
        onUpdate,
        autocompletion({override: [myCompletions]})
      ],
    })

    const view = new EditorView({ state: startState, parent: editor.current })

    return () => {
      view.destroy()
    }
  }, [])

  return (
    <div ref={editor} className="editor"></div>
  )
}