// Javascript Object that encapsulates a setting value that is stored in Local Storage
class PersistentSetting {

  // element: A p5.Element
  // name: the name used to store the value in Local Storage.
  constructor(element, name) {
    this.element = element;
    this.name = name;

    let localStorageValue = localStorage[name];
    if (localStorageValue !== undefined) {
      this.element.value(localStorageValue);
    }

    this.element.changed(this.storeData);
    
    this.displayElement = createDiv(`${this.name}: ${this.element.value()}`);
    this.element.input(this.updateOutput);
  }

  storeData = () => {
    console.log('storeData:', this.name, ',', this.element.value());
    localStorage[this.name] = this.element.value();

  }
    
  updateOutput = () => {
    this.displayElement.html(`${this.name}: ${this.element.value()}`);
  }

  setValue = (x) => {
    this.element.value(x);
  }

  value = (x) => {
    
    if (x !== undefined) {
      return this.element.value(x);
    }
    
    return this.element.value();
  }
};
