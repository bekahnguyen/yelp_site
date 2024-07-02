async function seesReview(wineId) {
  try {
    const response = await fetch(`/api/winery/${wineId}/reviews`);
    let result = await response.json();
    if (result.error) throw result.error;
    return result;
  } catch (error) {
    console.log("Oh no, couldn't get reviews");
  }
}

export { seesReview };
