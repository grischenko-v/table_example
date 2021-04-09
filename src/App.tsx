import React, {SetStateAction, useState} from 'react';
import Table from 'rc-table';
import clsx from 'clsx';
import data from './data';
import './App.css';

interface Irow {
    type: string,
}

const cellRenderer = (selectedRows: String[], selectedLeafs: String[]) => (value: Array<any>, row: Irow) => {
    const isRowSelected = selectedRows.indexOf(value[0].toString()) !== -1;
    const isLeafSelected = selectedLeafs.find(item => item === value.toString());
    return <span data-id={value}
                 data-row={value[0]}
                 className={clsx(
                     'cell',
                     'cell' + row.type,
                     isRowSelected && 'row__selected',
                     isLeafSelected && 'cell__selected',
                 )}/>
}

const onCell = (selectedRows: String[],
                selectedLeafs: String[],
                setSelectedLeafs: SetStateAction<any>,
                setSelectedRows: SetStateAction<any>,
                setClickedData: SetStateAction<any>,
) => (record: any) => ({
    onClick(e: any) {
        setClickedData({name: record.name, type: record.type, position: e.target.dataset.id})
    },
    onDoubleClick(e: any) {
        const rowIndex = e.target.dataset.row;
        const id = e.target.dataset.id || ''
        const rowIsSelected = selectedRows.indexOf(rowIndex) === -1;
        const leafIsSelected = selectedLeafs.indexOf(id) === -1;

        if (record.type === 'Node' || !rowIsSelected && leafIsSelected) {
            return;
        }

        if (rowIsSelected) {
            setSelectedRows([...selectedRows, rowIndex])
        }

        const index = selectedLeafs.indexOf(id);
        if (leafIsSelected) {
            setSelectedLeafs([...selectedLeafs, e.target.dataset.id]);
            return;
        }
        setSelectedLeafs((leafs: String[]) => {
            const copy = [ ...leafs ];
            copy.splice(index, 1);
            return copy;
        });
        setSelectedRows((rows: any) => {
            const copy = [ ...rows ].filter(row => row !== rowIndex);
            return copy;
        });
    }
});

function App() {
    const [selectedLeafs, setSelectedLeafs] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [clickedData, setClickedData] = useState({name: '', type: '', position: ''});

    const columns = [
        {
            title: 'Tree Name',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            render: (value: string) => {
                return <span className='cell cell_first-column'>{value}</span>
            },
        },
        {
            title: 'Column Header',
            dataIndex: '',
            key: 'Column Header',
            children: new Array(7).fill(0).map((_, index) => ({
                title: `${index}`,
                dataIndex: `column_${index}`,
                key: `column_${index}`,
                width: 50,
                render: cellRenderer(selectedRows, selectedLeafs),
                onCell: onCell(selectedRows, selectedLeafs, setSelectedLeafs, setSelectedRows, setClickedData)
            }))
        },
    ];

    return (
        <div className='table-wrapper'>
            <Table columns={columns} data={data}/>
            <div className='info-wrapper'>
                <div>
                    Name: {clickedData.name}
                </div>
                <div>
                    Type: {clickedData.type}
                </div>
                <div>
                    Position(y,x): {clickedData.position}
                </div>
            </div>
        </div>
    );
}

export default App;
