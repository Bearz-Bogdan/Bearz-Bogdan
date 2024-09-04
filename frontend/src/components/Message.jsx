import {Alert} from 'react-bootstrap'

import React from 'react'

const Message = ({variant, children}) => {  //variant reprezinta tipul de mesaj (info, danger, success, warning)
  return (                                  //children reprezinta mesajul propriu-zis             
    <Alert variant={variant}>
        {children}
    </Alert>
  )
}

Message.defaultProps = {
    variant: 'info'         //daca nu se specifica un tip de mesaj, se va afisa un mesaj de tip info
}

export default Message