import { useEffect, useState } from 'react';

export default function useFetch(fetcher) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;

    fetcher().then((result) => {
      if (active) {
        setData(result);
      }
    });

    return () => {
      active = false;
    };
  }, [fetcher]);

  return data;
}
