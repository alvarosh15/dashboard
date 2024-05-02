export async function search(url, inputs) {
  Object.keys(inputs).forEach((key) => {
    if (Array.isArray(inputs[key])) {
      inputs[key].forEach((value) => {
        url += value ? `${key}=${value}&` : "";
      });
    } else {
      url += inputs[key] ? `${key}=${inputs[key]}&` : "";
    }
  });
  url = url.slice(0, -1);
  console.log(url);
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

/*export async function getScores() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scores`);
  const data = await res.json();
  const scoreMap = data.reduce((acc, score) => {
    acc[score.ScoreId] = score.ScoreName;
    return acc;
  }, {});
  return scoreMap;
}*/

export async function getDict(url, key) {
  const res = await fetch(url);
  const data = await res.json();
  const dict = data.reduce((acc, elem) => {
    acc[elem[`${key}Id`]] = elem[`${key}Name`];
    return acc;
  }, {});
  return dict;
}
