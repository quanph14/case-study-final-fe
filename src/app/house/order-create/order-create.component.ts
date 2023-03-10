import {Component, OnInit} from '@angular/core';
import {OrderDTO} from "../../model/order-dto";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {OrderService} from "../../service/order.service";
import {Order} from "../../model/order";
import {House} from "../../model/house";
import {HouseService} from "../../service/house.service";
import * as moment from "moment";
import {UserService} from "../../service/user.service";
import {EmailDetails} from "../../model/emailDetails";
import {EmailService} from "../../service/email.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-oder-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  hostName: string = "";
  object!: Order;
  emailDetails: EmailDetails = {
    recipient: "",
    msgBody: "",
    subject: "",
    attachment: "",
  }
  id: number = 0;
  totalPrice: number = 0;
  rent!: any;
  house!: House;
  listOrders: Order[] = [];
  order: OrderDTO = {
    usersId: Number(localStorage.getItem('ID')),
    houseId: 0,
    orderStatusID: 1,
    startTime: null,
    endTime: null,
    createTime: new Date()

  }
  orderForm: FormGroup | undefined | any;

  constructor(
    private emailService: EmailService,
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private houseService: HouseService,
    private orderService: OrderService,
  ) {
    this.activateRoute.paramMap.subscribe((paraMap: ParamMap) => {
        // @ts-ignore
        this.id = +paraMap.get('id');
      }
    )
    this.houseService.findById(this.id).subscribe(res => {
      this.house = res;
      this.emailDetails.recipient = String(this.house.user?.email);

      this.hostName = String(this.house.user?.fullName);
    });
    this.getAllOrderByHouseId(this.id);
  }

  ngOnInit(): void {
    this.createOrder();
    // this.getAllOrder();
  }

  getAllOrderByHouseId(id: number) {
    this.orderService.showOrderByHouseId(id).subscribe(result => {
        this.listOrders = result;
      }, error => {
        console.log(error);
      }
    )
  }

  getRentHouse(id: number) {
    return this.houseService.findById(id).subscribe(house => {
      this.rent = house.rent
    })
  }

  getTotalRent() {
    this.totalPrice = (this.order.endTime - this.order.startTime) * this.rent;
  }

  createOrder() {
    this.orderForm = new FormGroup({
      userId: new FormControl(),
      houseId: new FormControl(),
      orderStatusID: new FormControl(),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      createTime: new FormControl('', [Validators.required])
    })
  }

  myFilter = (d: Date | null): boolean => {
    let a = moment(d).isAfter(Date.now(), "day")
    // !a ||
    if (!a) {
      return false
    } else {
      for (let i = 0; i < this.listOrders.length; i++) {
        this.object = this.listOrders[i];
        let isNotCollapseTime = moment(d).isBefore(this.object.startTime, 'day') || moment(d).isAfter(this.object.endTime, 'day');
        if (!isNotCollapseTime) {
          return false
        }
      }
      return true;
    }
  }

  sendMail() {
    this.emailDetails.subject = "B???n c?? m???t ????n thu?? nh?? ch??? x??c nh???n";
    this.emailDetails.msgBody = "B???n c?? 1 order c???a kh??ch h??ng t??n: " + this.hostName + " ???? t???o v??o l??c" + this.order.createTime + " th???i gian mu???n thu?? t??? ng??y " + this.order.startTime + " ?????n ng??y " + this.order.endTime + " vui l??ng v??o ki???m tra v?? x??c th???c.";
    this.emailService.sendMail(this.emailDetails).subscribe(res => {
    })
  }

  submit() {
    this.order.houseId = this.id;
    this.orderService.createOrder(this.order, this.id).subscribe(() => {
        this.sendMail();
        Swal.fire(
          ' ',
          '<h2 style="color: green; font-size: 32px">????ng k?? th??nh c??ng</h2>',
          'success'
        )
      }, error => {
        Swal.fire(
          ' ',
          '<h2 style="color: red; font-size: 32px">???? tr??ng ng??y!!!</h2>',
          'error'
        )
      }
    );
    this.orderForm.reset();
  }

}
