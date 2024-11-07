import type { PageLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageLoad = async({ params }) => {
    let resultList = await pb.collection('movies').getFullList({sort: '-created'});
	return {data: resultList};
};