import React, { Component } from 'react';
import ShoppingItem from '../../components/ShoppingItem/ShoppingItem';
import ShoppingNavBar from '../../components/ShoppingNavBar/ShoppingNavBar';
import classes from './CoffeeShop.module.css';
import ShoppingSummary from '../../components/ShoppingSummary/ShoppingSummary';
import axios from 'axios';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner'
import axiosErrorHandling from '../../../hoc/AxiosErrorHandling/AxiosErrorHandling';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

export class CoffeeShop extends Component {
    state={
        items: [],

        // items:[{name:'Tangerine',
        // count:1,
        // price: 1, 
        // description:' Among micronutrients, vitamin C is in 32% of the Daily Value in a 100 gram reference serving.'}, 
        // {name:'Apple',
        // count:0,
        // price: 2, 
        // description:'A typical apple serving provides a moderate content of dietary fiber.'},
        // {name:'Kiwi',
        // count:2,
        // price: 3, 
        // description:'It is particularly rich in vitamin C (112% DV) and vitamin K (38% DV), and vitamin E (10% DV).' }],


        showShoppingSummary: false,
        loading: false,
        totalPrice: 0
    }

    componentDidMount(){
        console.log('this is componentDidMount');
        console.log(this.props.testVar);
        this.props.onTest();
        console.log(this.props.testVar);
        let fetchedItems=null;
        this.setState({loading: true});
        axios.get('https://shoppingcart-9ee7a.firebaseio.com/initialItems.json')
            .then(response=>{
                fetchedItems= response.data.items;
                for (let i=0; i<fetchedItems.length; i++){
                    console.log('this is for loop fetchedItems i name ', fetchedItems[i].name);
                    let item = [...this.state.items];
                   //let item=[];
                     item[i] = fetchedItems[i];
                     console.log(item[i].name);
                    this.setState({items: item});
                }
        
                this.setState({loading: false});
            })
    }

    addItem=(index)=>{
        let newCount = this.state.items[index].count +1 ;
        console.log(this.state.items[index]);
        const updatedItems ={
            ...this.state.items
        }
        console.log('updated items ', updatedItems);
        const updatedItemsElement ={
            ...updatedItems[index]
        }
        console.log('updated items element ', updatedItemsElement);
        updatedItemsElement.count= newCount;
        console.log('updated items element after update ', updatedItemsElement);
        updatedItems[index] = updatedItemsElement;
        console.log('updated items after update ', updatedItems);
        
        this.setState(Object.assign(this.state.items, updatedItems));

     // this.setState({items: updatedItems});
    //    this.setState({items : {...updatedItems}});
    //    this.setState({items : ...updatedItems});
    //    this.setState({this.state.items : ...updatedItems});
    //    this.setState((this.state.items : ...updatedItems));
    //    this.setState((this.state.items, ...updatedItems));
       // this.setState({...this.state.items[index], count : updatedItemsElement.count});
        //error this.setState({...this.state, items : updatedItems});
       // this.setState({...this.state.items[index], count : updatedItemsElement.count});
        //error this.setState({...this.state, items : updatedItems});
    
        console.log('updated item after setState', this.state.items[index]);

        // delete this.state.items[index].count;
      //  this.state.items[index].count = newCount; 
        // this.setState(prevState=>{
        //     let lala = Object.assign({}, prevState.items[index]);
        //     lala.count=newCount;
        //     return{lala}

        // })

        // this.setState({...this.state.items[index], 
        //     count: newCount })


        // this.setState(prevState=>({
        //     items: prevState.items.map(
        //         item=>item.key === key ? {...item, count : newCount} : item
        //     )
        // })); 


        // console.log('lala');
        // console.log(this.state.items[index].count);
        // console.log(newCount);
    }

    removeItem=(index)=>{
        if(this.state.items[index].count>0){
        let newCount = this.state.items[index].count -1 ;
        const updatedItems ={
            ...this.state.items
        }
        const updatedItemsElement ={
            ...updatedItems[index]
        }
        updatedItemsElement.count= newCount;
        updatedItems[index] = updatedItemsElement;
        this.setState(Object.assign(this.state.items, updatedItems));
    }
}

    countTotalPrice=()=>{
        let finalPrice=0;
        this.state.items.map(item=>finalPrice= finalPrice + (item.count*item.price) )
        this.setState({totalPrice: finalPrice});
        
    }

    showShoppingSummaryModal=()=>{
        this.setState({showShoppingSummary: !this.state.showShoppingSummary})
        this.countTotalPrice();
    }

    submitOrder=()=>{
        if (this.state.totalPrice){
            this.setState({loading:true});

        let orderedItems=[];
        orderedItems=this.state.items.filter(item=>item.count>0);
        console.log('this is orderedItems from submit order ', orderedItems);

        const order = {
            items: orderedItems,
            totalPrice: this.state.totalPrice
        }

        axios.post('/orders.json', order)
        .then(response=>{
            this.setState({loading:false})
        })
        .catch(error=>{
            this.setState({loading:false})
        })

        setTimeout(()=>this.showShoppingSummaryModal(), 250);

        }

        let fetchedItems=null;
        this.setState({loading: true});
        axios.get('https://shoppingcart-9ee7a.firebaseio.com/initialItems.json')
            .then(response=>{
                fetchedItems= response.data.items;
                for (let i=0; i<fetchedItems.length; i++){
                    console.log('this is for loop fetchedItems i name ', fetchedItems[i].name);
                    let item = [...this.state.items];
                   //let item=[];
                     item[i] = fetchedItems[i];
                     console.log(item[i].name);
                    this.setState({items: item});
                }
        
                this.setState({loading: false});
            })
    }

    render() {
      console.log( this.props.testVar);
      console.log('this is shopping items ',this.state.items)
        let shoppingItems=[]; 
        if (this.state.loading || !this.state.items){
             shoppingItems=<Spinner/>; 
        }else{
            shoppingItems=this.state.items.map((item, index)=>{
                return(<ShoppingItem
                key={index}
                name={item.name}
                count={item.count}
                price={item.price}
                description={item.description}
                addItem={()=>this.addItem(index)}
                removeItem={()=>this.removeItem(index)}
                />)
            })
        }
        

        let modalOrSpinner =[];
        if (this.state.loading || !this.state.items){
            modalOrSpinner= <Spinner/>
        } else {
            modalOrSpinner=<ShoppingSummary
            items={this.state.items}
            totalPrice={this.state.totalPrice}
            submitOrder={this.submitOrder}
            exitModal={this.showShoppingSummaryModal}
          />
        }

        return (
            <div>
                <ShoppingNavBar clicked={this.showShoppingSummaryModal}/>
            <div className={classes.shoppingItems}>
             {shoppingItems}

             <Modal 
                show={this.state.showShoppingSummary} 
                exitModal={this.showShoppingSummaryModal}>
                {modalOrSpinner}
            </Modal>
            </div>

            </div>
        )
    }
}

const mapStateToProps=state=>{
    return{
        testVar: state.test1
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        onTest: ()=>dispatch(actions.testAction('this is test 1'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(axiosErrorHandling(CoffeeShop, axios));