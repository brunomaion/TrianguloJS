function maisEsquerda(p1, p2, p3){

  console.log(p1[1]);
  console.log(p2[1]);
  console.log(p3[1]);
  
  
  if (p1[1] <= p2[1] && p1[1] <= p3[1]){ // mais alto  0==X; 1==Y
      console.log('passou p1');
      if (p2[1]<=p3[1]) {
        console.log('passou p1+1');
        return [p1, p2, p3];

      } else {
        console.log('passou p1+2');
        return [p1, p3, p2];

      }

  } else if (p2[1] <= p1[1] && p2[1] <= p3[1]){ // mais alto  0==X; 1==Y
      console.log('passou p2');
      if (p1[1]<=p3[1]) {
        return [p2, p1, p3];
      } else {
        return [p2, p3, p1];
      }
  } else if (p3[1] <= p1[1] && p3[1] <= p2[1]){ // mais alto  0==X; 1==Y
      console.log('passou p3');
      if (p1[1]<=p2[1]) {
        return [p3, p1, p2];
      } else {
        return [p3, p2, p1];
      }
  } 
} 

