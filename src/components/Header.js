import Button from './Button';

const Header = ({ title, onAdd, showAddTask }) => {
  return (
    <header className='header'>
      <h1>{title}</h1>
      <Button text={showAddTask ? 'Close' : 'Add Task'} onClick={onAdd} color={showAddTask ? 'red' : 'green'} />
    </header>
  )
}

export default Header;
