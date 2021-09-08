import React from 'react';
import TextField from '@material-ui/core/TextField';
import GraphDataItem from './GraphDataItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { v4 as uuidv4 } from 'uuid';
import MyContext from './MyContext';

const style = { display: 'flex', flexDirection: 'column' }

const GraphDataContainer = ({ onUpdateDataSet }) => {
  const { setGraphData } = React.useContext(MyContext)
  const isInitialMount = React.useRef(true);

  const [inputData, setInputData] = React.useState('');
  const [dataList, setDataList] = React.useState([]);

  React.useEffect(() => {
    const graphData = JSON.parse(localStorage.getItem('dataList')).map(it => { return { ...it, time: new Date(it.time) } })

    if (graphData && Array.isArray(graphData) && graphData.length) {
      setGraphData(graphData)
      setDataList(graphData)
    }
  }, [])


  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      localStorage.setItem('dataList', JSON.stringify(dataList))
      setGraphData(dataList)
    }

  }, [dataList])

  const handleSetDataList = () => {
    if (inputData && Number(inputData)) {
      const appendItem = { time: new Date(), value: inputData, id: uuidv4() }
      const newData = [
        ...dataList,
        appendItem
      ].sort((a, b) => {
        if (a.time > b.time) {
          return 1
        }
        if (a.time < b.time) {
          return -1
        }
        return 0
      })
      setDataList(newData)
      setInputData('')
    }
  }

  const handleDeleteItem = (id) => {
    const newData = [...dataList]
    const index = newData.findIndex(item => item.id === id)
    newData.splice(index, 1)
    setDataList(newData)
  }

  return (
    <div style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Data"
          color="secondary"
          value={inputData}
          onChange={e => setInputData(e.target.value)}
        />
        <IconButton onClick={handleSetDataList}>
          <AddIcon />
        </IconButton>
      </div>
      {dataList.map((item, idx) => <GraphDataItem onDeleteItem={id => handleDeleteItem(id)} key={idx} value={item.value} time={item.time} id={item.id} />)}
    </div >
  )
}

export default GraphDataContainer;