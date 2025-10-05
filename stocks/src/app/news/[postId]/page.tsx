import type { Metadata } from 'next';
import parse from 'html-react-parser';
import '../../../screens/PostScreen/post-styles.css';
import { PostScreen } from '@/screens/PostScreen';
import { PageProps } from '../../../../.next/types/app/news/[postId]/page';

interface CustomPageProps<T> extends PageProps {
  params: PageProps['params'] & Promise<T>;
}

export async function generateMetadata({
  params,
}: CustomPageProps<{ postId: string }>): Promise<Metadata> {
  const { postId } = await params;
  const res = await fetch(`https://stocks-api.tyriantrade.com/api/stocks/article/${postId}`);

  const data = await res.json();

  return {
    title: `${data.title ?? ` Article - ${postId}`}`,
    description: data.description,

    openGraph: {
      title: data.title,
      description: data.description,
    },
  };
}

export default async function PostPage({ params }: CustomPageProps<{ postId: string }>) {
  const { postId } = await params;
  const res = await fetch(`https://stocks-api.tyriantrade.com/api/stocks/article/${postId}`);

  const data = await res.json();

  const options = {
    replace: (domNode: any) => {
      if (domNode.type === 'tag') {
        if (domNode.name === 'a') {
          return (
            <a href={domNode.attribs.href} className='post-link' rel='noopener noreferrer'>
              {domNode.children[0].data}
            </a>
          );
        }
      }
    },
  };

  return (
    <PostScreen
      content={<div className='post-content !text-white'>{parse(data.content, options)}</div>}
      title={data.title}
    />
  );
}
