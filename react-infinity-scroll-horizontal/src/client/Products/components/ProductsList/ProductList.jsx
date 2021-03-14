import React, { Component } from "react";

class ProductList extends Component {
    constructor() {
        super();
        this.state = {
            photos: [],
            loading: false,
            page: 0,
            prevY: 0
        };
        this.loadingRef = React.createRef();
    }

    componentDidMount() {
        this.getPhotos(this.state.page);

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        };

        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this),
            options
        );
        this.observer.observe(this.loadingRef);
    }

    handleObserver(entities, observer) {
        console.log(entities)
        const y = entities[0].boundingClientRect.y;
        if (this.state.prevY > y) {
            const lastPhoto = this.state.photos[this.state.photos.length - 1];
            const curPage = lastPhoto.albumId;
            this.getPhotos(curPage);
            this.setState({ page: curPage });
        }
        this.setState({ prevY: y });
    }

    getPhotos(page) {
        this.setState({ loading: true });
        fetch(
                `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
            )
            .then(res => res.json())
            .then(result => {
                this.setState({ photos: [...this.state.photos, ...result] });
                this.setState({ loading: false });
            });
    }

    render() {

        // Additional css
        const loadingCSS = {
            height: "100px",
            margin: "30px"
        };

        // To change the loading icon behavior
        const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

        const photoElements = this.state.photos.map(user => (
            <div>
                <img src={user.url} height="100px" width="200px" />
            </div>
        ));

        return (
            <div className="container">
                <div style={{ minHeight: "800px" }}>
                    {photoElements}
                </div>
                <div
                    ref={loadingRef => (this.loadingRef = loadingRef)}
                    style={loadingCSS}
                >
                    <span style={loadingTextCSS}>Loading...</span>
                </div>
            </div>
        );
    }
}

export default ProductList;