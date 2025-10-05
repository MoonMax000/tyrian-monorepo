import Paper from '@/components/Paper';

const data = {
  legal: [
    { name: 'Тикер эмитента', key: 'ticker', value: 'GTRK' },
    { name: 'Биржа', key: 'stock_market', value: 'MOEX' },
    { name: 'ISIN', key: 'isin', value: 'RU000A0ZYD22' },
    { name: 'Дата IPO', key: 'ipo', value: '2017-03-11' },
  ],
  contacts: [
    { name: 'Страна', key: 'country', value: 'Россия' },
    { name: 'Валюта', key: 'currency', value: '₽' },
    { name: 'Сайт', key: 'site', value: 'https://globaltruck.ru' },
  ],
};

const StockAbout = () => {
  return (
    <Paper>
      <h3 className='text-h4'>О Глобалтрак Менеджмент</h3>

      <div className='grid grid-cols-[60%,auto] gap-6 mt-6'>
        <div className='rounded-[4px] bg-[#272932] p-6 '>
          <p className='text-body-15'>
            Глобалтрак Менеджмент предоставляет услуги по транспортировке грузов на дальние
            дистанции, в том числе с соблюдением требуемого температурного режима, а также услуги по
            управлению цепочкой поставок. Компания обслуживает клиентов в России, охватывает такие
            регионы как Урал, Сибирь, Дальний Восток. Помимо этого, компания производит доставку
            грузов в Евросоюз. В парк Глобалтрак входит более 1200 тягачей, а их средний возраст
            составляет 2,6 года – это один из самых молодых парков в отрасли. Выручка в 2016 году
            составила более 6 миллиардов рублей, по сравнению с 4 миллиардами в 2014 году. История
            компании начинается с основания холдинга GT Globaltruck Limited, которая в 2012 году
            приобретает компании Lorry и Magna, парк компании в то время составлял 412 тягачей. В
            2017 году компания провела IPO на Московской бирже.
          </p>
        </div>

        <div>
          <div className='rounded-[4px] bg-[#272932] p-6 '>
            <p className='text-body-15 opacity-[48%] mb-1'>Адрес:</p>
            <p className='text-body-15'>
              3-й Тихорецкий пр., д. 22, Краснодар, Краснодарский край, 350059
            </p>
          </div>

          <div className='flex items-start gap-[25%] mt-6'>
            <ul className='flex flex-col gap-2'>
              {data.legal.map((item) => (
                <li key={item.key} className='flex items-center'>
                  <p className='text-body-15 opacity-[48%]'>
                    {item.name}:&nbsp;
                  </p>
                  <p className='text-body-15'>{item.value}</p>
                </li>
              ))}
            </ul>

            <ul className='flex flex-col gap-2'>
              {data.contacts.map((item) => (
                <li key={item.key} className='flex items-center'>
                  <p className='text-body-15 opacity-[48%]'>
                    {item.name}:&nbsp;
                  </p>
                  {item.key === 'site' ? (
                    <a
                      href={item.value}
                      target='_blank'
                      rel='noreferrer noopener'
                      className='text-body-15 underline underline-offset-2'
                    >
                      {item.value.replace('https://', '')}
                    </a>
                  ) : (
                    <p className='text-body-15'>{item.value}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default StockAbout;
