import { useMutation } from '@tanstack/react-query';
import { divisionType } from '@/helpers/types/setupSchema';

async function updateDivision(data: divisionType) {
  try {
    const config = {
      method: 'PATCH',
      headers: {
        'Authorization': 'token 9c031f9de0e7fe7cf1bbd63062b007d07bb92319',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    };
    const res = await fetch(
      `https://yp3.yahshuasolutions.com/api/divisions/division/${data.id}/`, config);

      if (!res.ok) {
        throw await res.json();
      }
      return res.json();
    } catch (err: any) {
      if (err.response) {
        throw err.response.data.message;
      }
      throw err.message;
    }
  }
   
function useUpdateDivision() {
  const mutation = useMutation({
    mutationFn: (data: divisionType) =>updateDivision(data)
  });
  return mutation;
}

export default useUpdateDivision;
