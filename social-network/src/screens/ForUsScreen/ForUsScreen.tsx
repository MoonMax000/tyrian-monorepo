'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import Pagination from '@/components/UI/Pagination';
import Post from '@/components/Post';
import RecommendedList from '@/components/Recommended/RecommendedList';
import { recommendedData } from '@/components/Recommended/constatnts';
import { setSearchCategory } from '@/store/slices/searchSlice';
import IconBgPost from '@/assets/forus-post.png';
import IconBgPost2 from '@/assets/forus-post2.png';
import IconBgPost3 from '@/assets/forus-post3.png';
import IconBgPost4 from '@/assets/forus-post4.png';
import { SearchFilter } from '@/components/Header/components/SearchBar/types';

const messages = [
  'In recent years, artificial intelligence (AI) has become an integral part of the global economy. However, its impact on emerging economies raises serious concerns. Automated systems and algorithms, designed to improve efficiency, are beginning to replace traditional jobs—leaving millions without a source of income. In regions already struggling with economic instability, the rise of AI only deepens existing issues of inequality and poverty.',
  'On the other hand, the continued development of various activities significantly drives the creation of new strategic directions. In this context, introducing a new organizational model serves as a valuable experiment in testing growth frameworks. High-level strateg`ic thinking, along with the strengthening and evolution of internal structures, plays a key role in shaping effective training systems that address current workforce needs.Our broad and diverse experience — supported by ongoing communication and outreach — helps lay the groundwork for inclusive, large-scale participation. At the same time, it’s important to recognize that effective training enables a wider range of professionals to actively shape their roles and responsibilities in meeting organizational goals.',
];

const ForUsScreen = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      dispatch(setSearchCategory(category as SearchFilter));
    }
  }, [searchParams]);

  return (
    <section className='flex items-start justify-between gap-6'>
      <div className='flex flex-col'>
        <div className='flex flex-col gap-6'>
          <Post typeTag='videos' title='New Tools for Crypto Analytics' bgImg={IconBgPost.src} />
          <Post
            typeTag='videos'
            title='New Tools for Crypto Analytics'
            message={messages[1]}
            bgImg={IconBgPost2.src}
          />
          <Post typeTag='ideas' bgImg={IconBgPost3.src} />
          <Post
            typeTag='ideas'
            title='AI Constructs Threaten Emerging Economies: A New Wave of Unemployment and Inequality'
            message={messages[0]}
            bgImg={IconBgPost4.src}
          />
          <Post
            typeTag='softwares'
            title='The New Script now Available!'
            isBlur={true}
            textScript='Hello world!'
          />
          <Post
            typeTag='softwares'
            title='The New Script now Available!'
            message={messages[1]}
            isBlur={true}
            textScript='Hello world!'
          />
          <Post
            typeTag='softwares'
            title='The New Script now Available!'
            message={messages[1]}
            textScript='Hello world!'
          />
        </div>

        <Pagination totalPages={20} currentPage={1} onChange={() => {}} />
      </div>
      <RecommendedList RecommendedList={recommendedData} />
    </section>
  );
};

export default ForUsScreen;
