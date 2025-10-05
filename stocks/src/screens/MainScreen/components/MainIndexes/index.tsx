import Paper from '@/components/Paper';
import IndexesDiagram from './IndexesDiagram';
import IndexesSlider from './IndexesSlider';
import StocksSlider from '../StocksSlider';

const MainIndexes = () => {
  return (
    <Paper className='!px-0 pt-6 flex !pb-0 flex-col bg-blackedGray'>
      <IndexesDiagram />

      <div className='border-t-[2px] border-blackedGray'>
        <StocksSlider />
      </div>
    </Paper>
  );
};

export default MainIndexes;
