"use client"

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/TableBase";

type ColumnsProps = {
  name: string;
  cell: string;
  label: string;
}

type inputSelectProps = {
  option: string
  selected: boolean
}

type initialValueProps = {
  id: string;
  produto: string;
  marca: inputSelectProps[];
  ativo: boolean;
  qtdmin: string;
  unidade: string;
  editado?: boolean;
}

const columns: ColumnsProps[] = [
  {
    name: 'Produto',
    label: 'produto',
    cell: 'text',
  },
  {
    name: 'Marca',
    label: 'marca',
    cell: 'select',
  },
  {
    name: 'Quantidade Mínima',
    label: 'qtdmin',
    cell: 'input',
  },
  {
    name: 'Ativo',
    label: 'ativo',
    cell: 'radio',
  },
  {
    name: 'Unidade',
    label: 'unidade',
    cell: 'text',
  }
]

const initialValue: initialValueProps[] = [
  {
    id: "1",
    produto: 'Maminha',
    marca: [{ option: "Friboi", selected: true }, { option: "Sadia", selected: false }, { option: "Angus", selected: false },],
    qtdmin: '10',
    ativo: false,
    unidade: 'KG',
  },
  {
    id: "2",
    produto: 'Alcatra',
    marca: [{ option: "Friboi", selected: false }, { option: "Sadia", selected: true }, { option: "Angus", selected: false },],
    qtdmin: '8',
    ativo: true,
    unidade: 'KG',
  },
]

const RenderCell = (value: string | boolean | inputSelectProps[], columnType: string, onChange: (newValue: string | boolean | inputSelectProps[]) => void) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {}, 500)
    onChange(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex;
      const updatedOptions = value instanceof Array && value.map((option, index) => ({
        ...option,
        selected: index === selectedIndex
      }))
      onChange(updatedOptions);
  };

  if (columnType === 'input') {
    return (
      <input 
        type="text" 
        value={value as string}
        onBlur={handleInputChange}
        onChange={handleInputChange}
        className="text-black"
      />
    );
  } else if (columnType === 'radio') {
    return (
      <input 
        type="checkbox" 
        checked={value as boolean} 
        onChange={handleCheckboxChange} 
      />
    );
  } else if (columnType === 'select' && value instanceof Array) {
    return (
      <select value={value.find(option => option.selected)?.option} onChange={handleSelectChange} className="text-black">
        {value.map((option, index) => (
          <option key={index} value={option.option}>
            {option.option}
          </option>
        ))}
      </select>
    )
  } else {
    return value;
  }
} 

export default function Home() {
  const data: initialValueProps[] = initialValue;
  const [dataEdited, setDataEdited] = useState<initialValueProps[]>([]);

  const handleCellUpdate = (rowIndex: number, columnName: keyof initialValueProps, newValue: string | boolean) => {
    if (data && data[rowIndex]) {
      const updatedData = [...data];
      updatedData[rowIndex][columnName] = newValue;
      updatedData[rowIndex].editado = true
      
      const isExist = dataEdited.findIndex((obj) => obj.id === updatedData[rowIndex].id)
      if(isExist === -1) {
        setDataEdited((rest) => [...rest, updatedData[rowIndex]])
      } else {
        const novosObjetos = [...dataEdited]
        novosObjetos[isExist] = updatedData[rowIndex]
        setDataEdited(novosObjetos);
      }

      // setDataEdited(updatedData[rowIndex]);
      // setData(updatedData);
      console.log(dataEdited);
      // console.log(updatedData);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen w-full bg-slate-700">
      <Table className="w-[800px] m-auto">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
                <TableHead className="w-[100px]" key={col.name}>{col.name}</TableHead>              
            ))}
          </TableRow>          
      </TableHeader>
      <TableBody>
          {initialValue.map((row, rowIndex) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.name}>
                  {RenderCell(row[col.label as keyof initialValueProps], col.cell, (newValue) => handleCellUpdate(rowIndex, col.label, newValue))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <div>
          <pre>{JSON.stringify(dataEdited,null,2)}</pre>  
        </div>
      </Table>
    </main>
  );
}
