import React, { Component } from "react";

import "./ProductList.scss";

class ProductList extends Component {
    constructor() {
        super();
        this.state = {
            photos: [],
            loading: false,
            limit: 10,
            prevX: 0
        };
        this.loadingRef = React.createRef();
        this.rootRef = React.createRef();
    }

    componentDidMount() {
        this.getPhotos(this.state.limit);

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0 // при полном пересечении срабатывает IntersectionObserver
        };

        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this),
            options
        );

        this.observer.observe(this.loadingRef);
    }

    handleObserver(entities, observer) {
        const x = entities[0].boundingClientRect.x;
        if (this.state.prevX > x) {
            this.getPhotos(this.state.limit + 10);
            this.setState({ limit: this.state.limit + 10 });
        }
        this.setState({ prevX: x });
    }

    getPhotos(limit) {
        this.setState({ loading: true });
        fetch(
                `https://jsonplaceholder.typicode.com/photos?_page=1&_limit=${limit}`
            )
            .then(res => res.json())
            .then(result => {
                this.setState({ photos: [...result] });
                this.setState({ loading: false });
            });
    }

    render() {

        // To change the loading icon behavior
        const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

        const photoElements = this.state.photos.map(({id}) => (
            <div className="product-item" key={id}>
                {id}
            </div>
        ));

        return (
            <div ref={rootRef => (this.rootRef = rootRef)} className="product-container">
                    {photoElements}
                <div className="product-loading"
                    ref={loadingRef => (this.loadingRef = loadingRef)}
                >
                    <span style={loadingTextCSS}>Loading...</span>
                </div>
            </div>
        );
    }
}

export default ProductList;