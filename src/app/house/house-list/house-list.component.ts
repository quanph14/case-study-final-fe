import {Component, OnInit} from '@angular/core';

import {House} from "../../model/house";
import {HouseService} from "../../service/house.service";
import {Image} from "../../model/Image";


@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.css']
})
export class HouseListComponent implements OnInit{
  id: number = 0;
  houses: House[] = [];
  listImage: Image[] = [];
  listFirstImage: string[] = [];
  constructor(private houseService: HouseService) {
  }

  ngOnInit() {
    this.getAllHouse();
  }
  getAllHouse(){
    this.houseService.getAll().subscribe(result => {
        this.houses = result;
      // console.log(this.houses)

      for (let i = 0; i < this.houses.length; i++) {
        // @ts-ignore
        this.listFirstImage.push(String(this.houses[i].image[0].imageName))
      }
      }, error => {
        console.log(error);
      }
    )
  }
}
