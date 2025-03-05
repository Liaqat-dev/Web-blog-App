import {ReactNode, useState} from "react";

import {NotificationContext} from "./useNotification";

interface Props {
    children: ReactNode;
}

export function NotificationProvider({children}: Props) {
    const [bgColor, setBgColor] = useState('');
    const [notification, setNotification] = useState({type: '', value: ''});

    let timeoutID: number;
    const updateNotification = (type: string, value: string) => {
        if (timeoutID) return clearInterval(timeoutID);
        if (!type || !value) return;

        switch (type) {
            case 'error':
                setBgColor('bg-red-400');
                break;
            case 'success':
                setBgColor('bg-green-500');
                break;
            case 'warning':
                setBgColor('bg-orange-400');
                break;
            default:
                setBgColor('bg-red-500');
        }
        setNotification({type, value});
        timeoutID = setTimeout(() => {
            setNotification({type: '', value: ''});
        }, 2000)
    }
    return <>
        <NotificationContext.Provider value={{updateNotification: updateNotification}}>
            {
                children
            }
        </NotificationContext.Provider>{
        notification.value ?
            <div className={'flex items-center justify-center w-full duration-200'}>
                <div className={`${bgColor} rounded-md  fixed bottom-9  `}><p
                    className={'text-white'}>{notification.value}</p>
                </div>
            </div>
            : null
    }
    </>

}
