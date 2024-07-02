export default function EditWinery(winery) {
  console.log(winery);
  console.log(winery);
  return (
    <>
      <form>
        <input
          type="text"
          value={winery.name}
          onChange={(e) => setWineryName(e.target.value)}
        />
        <input
          type="text"
          value={winery.address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          value={winery.description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          value={winery.phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          value={winery.hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <input
          type="text"
          value={winery.ava_district_id}
          onChange={(e) => setAVADistrictId(e.target.value)}
        />
        <input
          type="text"
          value={winery.Img}
          onChange={(e) => setImg(e.target.value)}
        />
        <input
          type="text"
          value={winery.website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <input
          type="text"
          value={winery.reservations_required}
          onChange={(e) => setReservations(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </>
  );
}
