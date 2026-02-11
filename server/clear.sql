DELETE FROM cached_searches WHERE query_hash LIKE 'on-this-day-%' OR query_hash LIKE 'wiki-%' OR results LIKE '%wiki-%';
