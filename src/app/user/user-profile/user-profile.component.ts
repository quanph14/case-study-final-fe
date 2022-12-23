import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  userForm:FormGroup | any;
      userId! : any;
      userName: any;
      id: number | any;
      fullName: any;
      avatar: any;
      userAddress:any;
      email:any;
      phoneNumber:any;

  ngOnInit(): void {
  }
  constructor(private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute  ) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      // @ts-ignore
      this.id = +paramMap.get('id');
      this.initializeForm();
      this.getUser(this.id)
    });
  }
  initializeForm(){
    this.userForm = new FormGroup({
      fullName: new FormControl(),
      avatar: new FormControl(),
      userAddress: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl()
    });
  }

  getUser(id: number) {
    return this.userService.getUserProfile(id).subscribe(userr => {
      this.userName = userr.username
      this.userId = userr.id
      this.fullName = userr.fullName
      this.avatar = userr.avatar
      this.userAddress = userr.userAddress
      this.email = userr.email
      this.phoneNumber = userr.phoneNumber
    });
  }
}
