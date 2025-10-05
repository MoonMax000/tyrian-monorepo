import CreateProduct from '@/screens/CreateProduct';
import React, { Suspense } from 'react';

export default function CreateProductPage() {
  return (
    <Suspense>
      <CreateProduct />
    </Suspense>
  );
}
