import { contexMenuStyle } from '../utils/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faListOl } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { useStore} from '../utils/store';

const ItemStyle =  {padding: '10px 5px 10px 5px', fontFamily: "sans-serif", borderBottomColor: 'f555'}

function Item(props) {
    return (
        <div style={ItemStyle} onClick={props.onClick}>
            <FontAwesomeIcon icon={props.icon} />
            <span>{props.label}</span>
        </div>
    )
}

function PaneContextMenu(props) {
    const lineNumbers = useStore(state => state.lineNumbers);
    const flipLineNumbers = useStore(state => state.flipLineNumbers);
    return (
        <div style={contexMenuStyle(props.top, props.left)} >
                {/* <Item icon={faCode} label="New Code Editor" onClick={props.addMonacoNode} />
                <Item icon={faComment} label="New Text Editor" onClick={props.addQuillNode} /> */}
                <ul className='contextMenu'>
                    <li onClick={props.addMonacoNode}> <FontAwesomeIcon icon={faCode} className='icon' /> New Code Editor </li>
                    <li onClick={props.addQuillNode}> <FontAwesomeIcon icon={faComment} className='icon' /> New Text Editor </li>
                    <li onClick={() => flipLineNumbers()}> <FontAwesomeIcon icon={faListOl} className='icon' /> {(lineNumbers==="on")?"Hide ":"Show "} Line Numbers</li>
                </ul>

        </div>
    )
}

export default PaneContextMenu;