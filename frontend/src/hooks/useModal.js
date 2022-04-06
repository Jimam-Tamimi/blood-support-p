import { useDispatch, useSelector } from "react-redux";
import { showModalAction } from "../redux/modal/actions";


export default function useModal() {
    const dispatch = useDispatch()
    const modal = useSelector((state) => state.modal)
    const showModal = (formId="report-form", data, Component= <></>, onSuccess) => {
            dispatch(showModalAction(formId, data, Component ))
    }

 
    
    return {showModal, modal}
}