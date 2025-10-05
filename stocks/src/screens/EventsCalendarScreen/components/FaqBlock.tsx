import AccordionItem, { AccordionItemModel } from '@/components/UI/AccordionItem';

const questions: AccordionItemModel[] = [
  {
    content: (
      <>
        Sberbank shares (SBER) trade on the <a
          className='text-purple underline underline-offset-2'
          target='_blank'
          href='https://google.com'
        >
          MOEX
        </a> (Moscow Exchange).
      </>
    ),
    title: 'Which exchange lists Sberbank (SBER) shares?',
  },
  {
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam reprehenderit dolores
      architecto nisi consequuntur sint facere debitis inventore nihil corrupti aut ipsam quidem,
      perspiciatis ullam aliquid suscipit! Ab, ad atque. Asperiores nisi quisquam delectus voluptate
      explicabo pariatur consectetur assumenda minus, saepe a veniam tempora incidunt fuga fugiat
      voluptatum neque mollitia? Fugit quis voluptas eligendi corrupti, cum eaque iste nulla! Saepe.
      Placeat maiores delectus rem est aperiam ratione! Sunt omnis rerum earum quos suscipit! Porro
      quam voluptate natus quos, sint officiis voluptas accusantium assumenda enim odit, optio
      impedit dolorem repellat placeat!`,
    title: 'What is the ticker symbol for Sberbank?',
  },
  {
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam reprehenderit dolores
      architecto nisi consequuntur sint facere debitis inventore nihil corrupti aut ipsam quidem`,
    title: 'Which sector and industry does Sberbank (SBER) operate in?',
  },
  {
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam reprehenderit dolores
      architecto nisi consequuntur sint facere debitis inventore nihil corrupti aut ipsam quidem`,
    title: 'What is Sberbank\'s current share price?',
  },
];

const FaqBlock = () => {
  return (
    <>
      <h3 className='text-h3 pl-6'>FAQ</h3>
      <p className='mt-4 pl-6 text-body-15 text-[#FFFFFFA3]'>
        We&apos;ve compiled answers to the most common questions about Sberbank.
        <br />
        If you have additional inquiries, please contact our {' '}
        <span className='underline underline-offset-2 text-white'>
          support team.
        </span>
      </p>
      <div className='flex flex-col gap-2 mt-[48px]'>
        {questions.map((question, index) => (
          <AccordionItem key={index} item={question} />
        ))}
      </div>
    </>
  );
};

export default FaqBlock;
