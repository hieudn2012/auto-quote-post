import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Modal from '@/components/Modal'
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

export enum Column {
  NAME = 'name',
  NOTES = 'notes',
  PROXY = 'proxy',
  GROUP = 'group',
  LAST_POST = 'last_post',
}

interface CustomShowColumnProps {
  checkedColumns: Column[]
  onApply: (columns: Column[]) => void
}

export const CustomShowColumn = ({ checkedColumns, onApply }: CustomShowColumnProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    values,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues: {
      columns: checkedColumns,
    },
    onSubmit: (values) => {
      onApply(values.columns)
      setIsOpen(false)
    },
  })
  const columns = [Column.NAME, Column.NOTES, Column.PROXY, Column.GROUP, Column.LAST_POST]

  const handleChangeColumn = (column: Column) => {
    if (values.columns.includes(column)) {
      setFieldValue('columns', values.columns.filter((c) => c !== column))
    } else {
      setFieldValue('columns', [...values.columns, column])
    }
  }

  useEffect(() => {
    if (isOpen) {
      setFieldValue('columns', checkedColumns)
    }
  }, [isOpen, checkedColumns, setFieldValue])

  return (
    <>
      <Button onClick={() => setIsOpen(true)} icon='fa-solid fa-filter'>Custom Show Column</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Custom Show Column">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {columns.map((column) => (
              <Checkbox key={column} checked={values.columns.includes(column)} onChange={() => handleChangeColumn(column)} label={column.toUpperCase()} />
            ))}
          </div>
          <div className="flex justify-end">
            <Button icon='fa-solid fa-check' type='submit'>Apply</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
