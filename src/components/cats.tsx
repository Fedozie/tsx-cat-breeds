import { useState, useEffect } from "react";
import axios from "axios";

type CatObject = {
  weight: number | null;
  lifeSpan: number | null;
};

const Cats = () => {
  const [catObject, setCatObject] = useState<CatObject>({
    weight: null,
    lifeSpan: null,
  });

  useEffect(() => {
    const strToNumAvg = (arr: any[]): number => {
      
      let newNumArr: number[] = arr.map ((str: string) => {
        let noSpacedStr: string = str.replace(/ /g, ""); //eliminates whitespace
        let numberedStr: string = noSpacedStr.replace("_", "."); //convert hyphen to dot
        parseFloat(numberedStr);
      });
      
      let numArrSum = newNumArr?.reduce((acc, curr) => acc + curr, 0);
      let numArrAvg = numArrSum / newNumArr?.length;
      let newAvg = numArrAvg.toFixed(2);
      return parseFloat(newAvg);
    };

    const loadData = async () => {
      await axios
        .get("https://api.thecatapi.com/v1/breeds")
        .then((res) => {
          let weights: any[] = [];
          let lifeSpans: any[] = [];
          let arrayCats = res.data;

          //Getting the average weights of the cat breeds
          let wtArr = arrayCats.forEach((catItem: any) => {
            weights.push(catItem.weight.metric);
          });
          let wtAvg = strToNumAvg(wtArr);

          //Getting the average for the life spans of cat breeds
          let lifeArr = arrayCats.forEach((catItem: any) => {
            lifeSpans.push(catItem.life_span);
          });
          let lifeSpanAvg = strToNumAvg(lifeArr);

          setCatObject({
            weight: wtAvg,
            lifeSpan: lifeSpanAvg,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    loadData();
  }, []);

  return (
    <div>
      <h2>Cats Paradise</h2>
      <h5>There are 67 Cat breeds</h5>
      <p>
        On an average, a cat can weigh {catObject.weight} kg and they can live
        up to {catObject.lifeSpan} years.
      </p>
    </div>
  );
};

export default Cats;
