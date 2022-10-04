import React, {useState} from 'react';

const EmitterContext = React.createContext();

export const EmitterProvider = ({children}) => {
    const [otp, setOtp] = useState('0');
    const generate = () =>{
        //math function taken from https://stackoverflow.com/questions/21816595/how-to-generate-a-random-number-of-fixed-length-using-javascript
        setOtp(`${Math.floor(100000 + Math.random() * 900000)}`)
  
    }
    return <EmitterContext.Provider value = {{code: otp, generate}}>{children}</EmitterContext.Provider>
}
export default EmitterContext;