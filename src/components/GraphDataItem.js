import GraphItem from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


const GraphDataItem = ({ time, value, id, onDeleteItem }) => (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div>{`${time.toTimeString().split('G')[0]} - ${value}`}</div>
  <IconButton onClick={() => onDeleteItem(id)}>
    <DeleteIcon />
  </IconButton>
</div>)

export default GraphDataItem;