import Controller from '@ember/controller';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

export default class DashboardController extends Controller {
    @service feature;
    @service session;
    @service membersStats;
    @service store;

    @tracked
    events = {
        data: null,
        error: null,
        loading: false
    };

    @tracked
    topMembers = {
        data: null,
        error: null,
        loading: false
    };

    constructor(...args) {
        super(...args);
        this.loadEvents();
        this.loadTopMembers();
    }

    loadEvents() {
        this.events.loading = true;
        this.membersStats.fetchTimeline().then(({events}) => {
            this.events.data = events;
            this.events.loading = false;
        }, (error) => {
            this.events.error = error;
            this.events.loading = false;
        });
    }

    loadTopMembers() {
        this.topMembers.loading = true;
        let query = {
            filter: 'email_open_rate:-null',
            order: 'email_open_rate desc',
            limit: 10
        };
        this.store.query('member', query).then((result) => {
            this.topMembers.data = result;
            this.topMembers.loading = false;
        }, (error) => {
            this.topMembers.error = error;
            this.topMembers.loading = false;
        });
    }
}
