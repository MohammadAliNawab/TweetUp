import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tweets } from './tweet';
import { User } from './user';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent {
  tweet: String = '';
  feeds: Tweets[] = [];
  users: User[] = [];
  currentUser!: User;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http.get<any>('http://localhost:4000/user/feed').subscribe(
      (response) => {
        if (response) {
          console.log(response);
          this.feeds = response;
        }
      },

      (error) => {
        if (error.status === 401) {
          console.log(
            'You are not authorized to visit this route.  No data is displayed.'
          );
        }

        console.log(error);
      },

      () => {
        console.log('HTTP request done');
      }
    );
    // For users
    this.http.get<any>('http://localhost:4000/user/allUsers').subscribe(
      (response) => {
        if (response) {
          console.log(response);
          this.users = response.users;
        }
      },

      (error) => {
        if (error.status === 401) {
          console.log(
            'You are not authorized to visit this route.  No data is displayed.'
          );
        }

        console.log(error);
      },

      () => {
        console.log('HTTP request done');
        // For current user

        this.http.get<any>('http://localhost:4000/user/profile').subscribe(
          (response) => {
            if (response) {
              this.currentUser = response.profile;
              console.log('current user', this.currentUser);
              this.users = this.users.filter(
                (obj) => obj._id !== this.currentUser._id
              );

              for (let i = 0; i < this.users.length; i++) {
                if (this.currentUser.follows.includes(this.users[i]._id)) {
                  this.users[i].following = true;
                } else {
                  this.users[i].following = false;
                }
              }
            }

            console.log('Flterted Array', this.users);
          },

          (error) => {
            if (error.status === 401) {
              console.log(
                'You are not authorized to visit this route.  No data is displayed.'
              );
            }

            console.log(error);
          },

          () => {
            console.log('HTTP request done');
          }
        );
      }
    );
  }
  postTweet() {
    console.log('Tweeted', this.tweet);
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    this.http
      .post(
        'http://localhost:4000/user/post/tweet',
        { tweet: this.tweet },
        {
          headers: headers,
        }
      )
      .subscribe(
        (response) => {
          this.tweet = '';
          this.ngOnInit();
        },

        (error) => {
          console.log(error);
        },

        () => {
          console.log('done! Tweet');
        }
      );
  }

  follow(userId: any) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    this.http
      .post(
        'http://localhost:4000/user/follow',
        { followId: userId },
        {
          headers: headers,
        }
      )
      .subscribe(
        (response) => {
          this.ngOnInit();
        },

        (error) => {
          console.log(error);
        },

        () => {
          console.log('done! Tweet');
        }
      );
  }
  unfollow(userId: any) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    this.http
      .post(
        'http://localhost:4000/user/unfollow',
        { unfollowId: userId },
        {
          headers: headers,
        }
      )
      .subscribe(
        (response) => {
          this.ngOnInit();
        },

        (error) => {
          console.log(error);
        },

        () => {
          console.log('done! Tweet');
        }
      );
  }
}
