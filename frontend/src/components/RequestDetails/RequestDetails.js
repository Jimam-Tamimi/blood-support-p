// import React, {useState} from 'react'
// import {FaBan} from 'react-icons/fa'



// import {
//     RequestDetailsMap,
//     RequestAllDetailsRow,
//     DetailsDiv,
//     ActionDiv,
//     Action,
//     ButtonDiv,
    
//     ProfileImg,
//     Profile,
// } from './RequestDetails.styles'


// import prof from '../../assets/img/prof.jpg'
// import {
//     Badge, 
//     Button, 
//     ButtonLink,
//     Detail,
//     DetailHeader,
//     DetailFieldValue,
//     DetailField,
// } from '../../globalStyles'

// import Map from '../Map/Map'
// import Dropdown from '../Dropdown/Dropdown'
// import {Marker} from 'react-google-maps'



// export default function RequestDetails({children}) {

//     const [details, setDetails] = useState({ 
//         name: 'Jimam Tamimi',
//         time: '02/1/2006',
//         bloodGroup: 'A+',
//         number: '92374857837',
//         addNumber: '4656564547',
//         email: 'jimamtamimi12@gmail.com',
//         description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima qui minus assumenda, accusantium quidem maiores sapiente ipsum. Eligendi illo dolore ',
//         coords: {lat:24.0077202, lng:89.2429551}
//     })
//     const report = () => {
//         // call api to report this request
//         console.log("report request" )
//     }

//     const [dropDownOption, setDropDownOption] = useState([
//         {name: "Report", icon: FaBan, onClick: report}
//     ])
    
    
//     const [cords, setCords] = useState({lat:24.0077202, lng:89.2429551})
    
    
//     return (
//         <>
//                     <RequestDetailsMap>
//                         <Map 
//                             coords={details.coords}  
//                             isMarkerShown
//                             googleMapURL=" "
//                             loadingElement={<div style={{ height: `350px`, width: '100%' }} />}
//                             containerElement={<div style={{ height: `350px`, width: '100%' }} />}
//                             mapElement={<div style={{ height: `350px`, width: '100%' }} />} 
//                             defaultZoom={14}
//                         >
//                             {
//                                 <Marker  
//                                 position={cords} 
//                                 /> 
//                             }
//                         </Map>  
//                     </RequestDetailsMap>
//                     <RequestAllDetailsRow>
//                         <DetailsDiv>
//                             <DetailHeader>Posted By: </DetailHeader>
//                             <Profile to="/">
//                                 <ProfileImg src={prof} />
//                                 <DetailFieldValue>{details.name}</DetailFieldValue>
//                             </Profile>
//                             <DetailHeader>Informations: </DetailHeader>
//                             <Detail>
//                                 <DetailField>Name: </DetailField>
//                                 <DetailFieldValue>{details.name}</DetailFieldValue>
//                             </Detail>
//                             <Detail>
//                                 <DetailField>Time: </DetailField>
//                                 <DetailFieldValue>{details.time}</DetailFieldValue>
//                             </Detail>
//                             <Detail>
//                                 <DetailField>Blood Group: </DetailField>
//                                 <DetailFieldValue>{details.bloodGroup}</DetailFieldValue>
//                             </Detail>
//                             <Detail>
//                                 <DetailField>Number: </DetailField>
//                                 <DetailFieldValue>{details.number}</DetailFieldValue>
//                             </Detail>
//                             <Detail>
//                                 <DetailField>Additional Number: </DetailField>
//                                 <DetailFieldValue>{details.number}</DetailFieldValue>
//                             </Detail>
//                             <Detail>
//                                 <DetailField>Email: </DetailField>
//                                 <DetailFieldValue>{details.email}</DetailFieldValue>
//                             </Detail>

//                             <DetailHeader>Description: </DetailHeader>
//                             <Detail>
//                                 <DetailFieldValue>{details.description}</DetailFieldValue>
//                             </Detail>
//                             <ButtonDiv>
//                                 {children}
//                             </ButtonDiv>

//                         </DetailsDiv>
//                         <ActionDiv>
//                             <Action>
//                                 <Dropdown  options={dropDownOption}/>
//                             </Action>
//                             <Action>
//                                 <Badge info style={{position: "absolute", width: "max-content", right: "6px", top: "20px"}} >10 Request Got</Badge>
                                    
//                             </Action>
//                         </ActionDiv>
//                     </RequestAllDetailsRow>
//         </>
//     )
// }



